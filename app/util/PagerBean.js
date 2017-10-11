//主要是用于分页

class PagerBean {
	constructor() {
		/**
	 * 当前页码
	 */
		this.pageNumber = 1
		/**
         * 总页数
         */
		this. pageCount = 0
		/**
         * 每页记录数
         */
		this. pageSize = 10
		/**
         * 总记录数
         */
		this. recordCount = 0
		/**
         * 查询起始
         */
		this. start = 0
		/**
         * 查询截止
         */
		this. end = 0
		/**
         * 查询关键字
         */
		this. keyword = null
		/**
         * 查询字段
         */
		this.field = null
		/**
         * 排序字段
         */
		this. orderField = null
		/**
         * 升序还是降序
         */
		this. sc = 'asc'
	}


	getSc() {
		return this.sc
	}

	setSc(sc) {
		this.sc = sc
	}

	getOrderField() {
		return this.orderField
	}

	setOrderField(orderField) {
		this.orderField = orderField
	}

	getKeyword() {
		return this.keyword
	}

	setKeyword(keyword) {
		this.keyword = keyword
	}

	getField() {
		return this.field
	}

	setField(field) {
		this.field = field
	}

	getEnd() {
		return this.end
	}

	setEnd(end) {
		this.end = end
	}

	getStart() {
		return this.start
	}

	setStart(start) {
		this.start = start
	}
	setData(recordCount) {
		this.start = (this.pageNumber - 1) * this.pageSize

		this.end = this.pageSize

		this.pageCount = recordCount / this.pageSize


		if (recordCount % this.pageSize != 0) {
			this.pageCount++
		}
		if (this.pageNumber > this.pageCount) {
			this.pageNumber = this.pageCount
		}
	}

	getPageNumber() {
		return this.pageNumber
	}

	setPageNumber(pageNumber) {
		this.pageNumber = pageNumber
	}

	getPageCount() {
		return this.pageCount
	}

	setPageCount(pageCount) {
		this.pageCount = pageCount
	}

	getPageSize() {
		return this.pageSize
	}

	setPageSize(pageSize) {
		this.pageSize = pageSize
	}

	getRecordCount() {
		return this.recordCount
	}

	setRecordCount(recordCount) {
		this.recordCount = recordCount
	}

}

var test = new PagerBean()

console.log(JSON.stringify(test),'\t')

//module.exports = PagerBean